import { dashboardService } from '~/modules/dashboard/service/dashboard.service'

export const useDashboard = () => {
  return useAsyncData('dashboard', () => dashboardService.getDashboard())
}
