
export default function StatusBadge({ status }: { status: number}) {
  return (
    <span
        className={`inline-flex border  items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
        status < 400
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : "bg-red-50 text-red-600 border-red-100"
        }`}>
        <span
            className={`w-1.5 h-1.5 rounded-full text-xl animate-pulse ${
            status < 400 ? "bg-emerald-500" : "bg-red-500"
            }`}
        />
        {status < 400 ? "Operational" : "Down"}
    </span>
  )
}
