import MonitorDashboard from "./_components/monitorDashboard"

export default async function MonitorPage({ params }: { params: Promise<{ id : string}>}) {
    
  const { id } = await params

  return <MonitorDashboard id={id} />
}