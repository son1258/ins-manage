import { createNewUser, disableUser, loadListUsers, loadUserById, updateUser } from "@/services/userService"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

export const useUserList = (params: any, token: string) => {
	return useQuery({
		queryKey: ['users', params],
		queryFn: async () => loadListUsers(params, token),
		enabled: !!token,
		placeholderData: (previousData) => previousData,
	})
}

export const useDisableUser = (token: string, t: any) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => disableUser({id}, token),
		onSuccess: () => {
			toast.success(t('success'));
			queryClient.invalidateQueries({ queryKey: ['users']});
		}
	})
}

export const useCreateUserMutation = (token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => createNewUser(data, token),
		onSuccess: (resp) => {
			if (resp && resp.success) {
				queryClient.invalidateQueries({
					queryKey: ['users']
				});
			}
		}
	})
}

export const useUserDetail = (id: string, token: string) => {
	return useQuery({
		queryKey: ['user-detail', id],
		queryFn: () => loadUserById(id, token),
		enabled: !!token
	})
}

export const useUpdateUserMutation = (token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => updateUser(data, token),
		onSuccess: (resp, variables) => {
			if (resp && resp.success) {
				queryClient.invalidateQueries({
					queryKey: ['user-detail', variables.id]
				});
				queryClient.invalidateQueries({
					queryKey: ['users']
				});
			}
		}
	})
}