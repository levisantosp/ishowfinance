type Props = {
  width: number
  height: number
}

export default function Loading(props: Props) {
  return (
    <div
      className='flex justify-center p-10'
    >
      <div
        className='flex items-center rounded-2xl p-5 gap-2'
      >
        <div
          className={`w-${props.width} h-${props.height} border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin`}
        />
      </div>
    </div>
  )
}