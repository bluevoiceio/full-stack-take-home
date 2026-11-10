import uuid
from typing import Annotated, List

from fastapi import APIRouter, Depends, Query
from fastapi.security import HTTPAuthorizationCredentials
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT

from src.api.common.auth import ADMIN_ROLES, credentials_scheme, user_from_auth_creds
from src.api.groups.schemas import AssignGroupUsersModel, GroupCreateModel, GroupResponseModel, GroupUpdateModel
from src.api.utils import user_can_access_department_id
from src.exceptions import UserNotAllowedToPerformAction
from src.models import AuthUser, Group
from src.services.group_service import GroupService

router = APIRouter(tags=["groups"])

GROUP_LIST_LIMIT = 500


def _get_accessible_group(user: AuthUser, group_id: uuid.UUID) -> Group:
    group = GroupService().get_group(group_id)
    if not user_can_access_department_id(user, group.department_id):
        raise UserNotAllowedToPerformAction()
    return group


def _response(group: Group) -> GroupResponseModel:
    return GroupResponseModel.from_group(group, GroupService().get_members(group))


@router.get("", response_model=List[GroupResponseModel])
def list_groups(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)],
    skip: int = Query(0, ge=0),
    limit: int = Query(GROUP_LIST_LIMIT, ge=1, le=GROUP_LIST_LIMIT),
):
    user = user_from_auth_creds(credentials, allowed_roles=ADMIN_ROLES)
    groups_with_members = GroupService().list_groups_with_members(user.department_id, skip=skip, limit=limit)
    return [GroupResponseModel.from_group(group, members) for group, members in groups_with_members]


@router.post("", response_model=GroupResponseModel, status_code=HTTP_201_CREATED)
def create_group(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)],
    create_model: GroupCreateModel,
):
    user = user_from_auth_creds(credentials, allowed_roles=ADMIN_ROLES)
    group = GroupService().create_group(name=create_model.name, department_id=user.department_id, created_by=user.sub)
    return GroupResponseModel.from_group(group)


@router.patch("/{groupId}", response_model=GroupResponseModel)
def update_group(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)],
    groupId: uuid.UUID,
    update_model: GroupUpdateModel,
):
    user = user_from_auth_creds(credentials, allowed_roles=ADMIN_ROLES)
    group = _get_accessible_group(user, groupId)
    return _response(GroupService().rename_group(group, update_model.name))


@router.delete("/{groupId}", status_code=HTTP_204_NO_CONTENT)
def delete_group(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)],
    groupId: uuid.UUID,
):
    user = user_from_auth_creds(credentials, allowed_roles=ADMIN_ROLES)
    group = _get_accessible_group(user, groupId)
    GroupService().delete_group(group.id)


@router.post("/{groupId}/assign", response_model=GroupResponseModel)
def assign_users(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)],
    groupId: uuid.UUID,
    assign_model: AssignGroupUsersModel,
):
    user = user_from_auth_creds(credentials, allowed_roles=ADMIN_ROLES)
    group = _get_accessible_group(user, groupId)
    GroupService().assign_users(group, assign_model.userIds)
    return _response(group)


@router.post("/{groupId}/unassign", response_model=GroupResponseModel)
def unassign_users(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)],
    groupId: uuid.UUID,
    unassign_model: AssignGroupUsersModel,
):
    user = user_from_auth_creds(credentials, allowed_roles=ADMIN_ROLES)
    group = _get_accessible_group(user, groupId)
    GroupService().unassign_users(group, unassign_model.userIds)
    return _response(group)
