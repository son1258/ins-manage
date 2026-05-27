import { createDistributor, disableDistributor, enableDistributor, loadDistributorById, loadDistributors, updateDistributor } from "@/services/distributorService"
import { handleApiError } from "@/utils/errorHandler"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

export const useDistributorList = (params: any, token: string) => {
	return useQuery({
		queryKey: ['distributors', params],
		queryFn: () => loadDistributors(params, token),
		enabled: !!token
	})
}

export const useDisableDistributor = (token: string, t: any) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => disableDistributor(data, token),
		onSuccess: () => {
			toast.success(t('success'));
			queryClient.invalidateQueries({queryKey: ['distributors']});
		},
		onError: (err) => {
			handleApiError(err, t);
		}
	})
} 

export const useDistributorDetail = (id: string, token: string) => {
	return useQuery({
		queryKey: ['distributor-detail', id],
		queryFn: () => loadDistributorById(id, token),
		enabled: !!token
	})
}

export const useUpdateDistributorMutation = (token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => updateDistributor(data, token),
		onSuccess: (resp, variables) => {
			if (resp && resp.success) {
				queryClient.invalidateQueries({
					queryKey: ['distributor-detail', variables.id]
				});
				queryClient.invalidateQueries({
					queryKey: ['distributors']
				})
			}
		}
	})
}

export const useCreateDistributorMutation = (token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => createDistributor(data, token),
		onSuccess: (resp) => {
			if (resp && resp.success) {
				queryClient.invalidateQueries({
					queryKey: ['distributors']
				});
			}
		}
	})
}

export const useEnableDistributorMutation = (token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => enableDistributor(data, token),
		onSuccess: (resp, variables) => {
			if (resp && resp.success) {
				queryClient.invalidateQueries({
					queryKey: ['distributor-detail', variables.id]
				});
				queryClient.invalidateQueries({
					queryKey: ['distributors']
				});
			}
		}
	})
}