import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Community_Key {
  id: UUIDString;
  __typename?: 'Community_Key';
}

export interface Course_Key {
  id: UUIDString;
  __typename?: 'Course_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface JoinProjectData {
  projectMember_insert: ProjectMember_Key;
}

export interface JoinProjectVariables {
  projectId: UUIDString;
}

export interface ListMarketplaceItemsData {
  marketplaceItems: ({
    id: UUIDString;
    title: string;
    description: string;
    price: number;
  } & MarketplaceItem_Key)[];
}

export interface ListProjectsData {
  projects: ({
    id: UUIDString;
    title: string;
    description: string;
  } & Project_Key)[];
}

export interface MarketplaceItem_Key {
  id: UUIDString;
  __typename?: 'MarketplaceItem_Key';
}

export interface ProjectMember_Key {
  userId: UUIDString;
  projectId: UUIDString;
  __typename?: 'ProjectMember_Key';
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface ListProjectsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProjectsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProjectsData, undefined>;
  operationName: string;
}
export const listProjectsRef: ListProjectsRef;

export function listProjects(): QueryPromise<ListProjectsData, undefined>;
export function listProjects(dc: DataConnect): QueryPromise<ListProjectsData, undefined>;

interface JoinProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: JoinProjectVariables): MutationRef<JoinProjectData, JoinProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: JoinProjectVariables): MutationRef<JoinProjectData, JoinProjectVariables>;
  operationName: string;
}
export const joinProjectRef: JoinProjectRef;

export function joinProject(vars: JoinProjectVariables): MutationPromise<JoinProjectData, JoinProjectVariables>;
export function joinProject(dc: DataConnect, vars: JoinProjectVariables): MutationPromise<JoinProjectData, JoinProjectVariables>;

interface ListMarketplaceItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMarketplaceItemsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMarketplaceItemsData, undefined>;
  operationName: string;
}
export const listMarketplaceItemsRef: ListMarketplaceItemsRef;

export function listMarketplaceItems(): QueryPromise<ListMarketplaceItemsData, undefined>;
export function listMarketplaceItems(dc: DataConnect): QueryPromise<ListMarketplaceItemsData, undefined>;

