export default function ToastWarning(text: string) {

  return (
    <div className="absolute bottom-40 left-1/2 -translate-x-1/2">
      <h4 className="text-red-500 text-2xl font-bold">{text}</h4>
    </div>
  )
}