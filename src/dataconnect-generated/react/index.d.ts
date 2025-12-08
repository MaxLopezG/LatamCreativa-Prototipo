import { CreateUserData, ListProjectsData, JoinProjectData, JoinProjectVariables, ListMarketplaceItemsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useListProjects(options?: useDataConnectQueryOptions<ListProjectsData>): UseDataConnectQueryResult<ListProjectsData, undefined>;
export function useListProjects(dc: DataConnect, options?: useDataConnectQueryOptions<ListProjectsData>): UseDataConnectQueryResult<ListProjectsData, undefined>;

export function useJoinProject(options?: useDataConnectMutationOptions<JoinProjectData, FirebaseError, JoinProjectVariables>): UseDataConnectMutationResult<JoinProjectData, JoinProjectVariables>;
export function useJoinProject(dc: DataConnect, options?: useDataConnectMutationOptions<JoinProjectData, FirebaseError, JoinProjectVariables>): UseDataConnectMutationResult<JoinProjectData, JoinProjectVariables>;

export function useListMarketplaceItems(options?: useDataConnectQueryOptions<ListMarketplaceItemsData>): UseDataConnectQueryResult<ListMarketplaceItemsData, undefined>;
export function useListMarketplaceItems(dc: DataConnect, options?: useDataConnectQueryOptions<ListMarketplaceItemsData>): UseDataConnectQueryResult<ListMarketplaceItemsData, undefined>;
