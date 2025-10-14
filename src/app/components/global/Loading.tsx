type Props = {
  width: number
  height: number
}

export default function Loading(props: Props) {
  return (
    <div
      className='flex justify-center'
    >
      <div
        className='flex items-center rounded-2xl gap-2'
      >
        <div
          className={`w-${props.width} h-${props.height} border-3 border-gray-100 border-t-blue-500 rounded-full animate-spin`}
        />
      </div>
    </div>
  )
}