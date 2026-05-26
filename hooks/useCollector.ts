import { createCollector, disableCollector, enableCollector, loadCollectorById, loadCollectors, updateCollector } from "@/services/collectorService"
import { handleApiError } from "@/utils/errorHandler"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

export const useCollectorList = (params: any, token: string, options?: any) => {
	return useQuery({
		queryKey: ['collectors', params],
		queryFn: () => loadCollectors(params, token),
		enabled: !!token,
		...options
	})
}

export const useDisableCollector = (token: string, t: any) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => disableCollector(data, token),
		onSuccess: () => {
			toast.success(t('success'));
			queryClient.invalidateQueries({queryKey: ['collectors']});
		},
		onError: (err) => {
			handleApiError(err, t);
		}
	})
}

export const useCreateCollectorMutation = (token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => createCollector(data, token),
		onSuccess: (resp) => {
			if (resp && resp.success) {
				queryClient.invalidateQueries({
					queryKey: ['collectors']
				});
			}
		}
	})
}

export const useCollectorDetail = (id: string, token: string) => {
	return useQuery({
		queryKey: ['collector-detail', id],
		queryFn: () => loadCollectorById(id, token),
		enabled: !!token
	})
}

export const useUpdateCollectorMutation = (token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => updateCollector(data, token),
		onSuccess: (resp, variables) => {
			if (resp && resp.success) {
				queryClient.invalidateQueries({
					queryKey: ['collector-detail', variables.id]
				});
				queryClient.invalidateQueries({
					queryKey: ['collectors']
				})
			}
		}
	})
}

export const useEnableCollectorMutation = (token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => enableCollector(data, token),
		onSuccess: (resp, variables) => {
			if (resp && resp.success) {
				queryClient.invalidateQueries({
					queryKey: ['collector-detail', variables.id]
				});
				queryClient.invalidateQueries({
					queryKey: ['collectors']
				});
			}
		}
	})
}