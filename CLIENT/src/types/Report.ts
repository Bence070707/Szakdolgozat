export type Report = {
    totalRevenue: number,
    totalSales: number,
    totalItemsSold: number,
    userReportData: UserReportData
}

export type UserReportData = {
    id: string,
    displayName: string,
    email: string
}