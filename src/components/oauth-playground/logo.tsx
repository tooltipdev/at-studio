function Logo({ size }: { size: 'sm' | 'md' | 'lg' }) {
  let textSize;

  switch (size) {
    case 'lg':
      textSize = 'text-3xl';
      break;
    case 'md':
      textSize = 'text-xl';
      break;
    default:
      textSize = 'text-lg';
  }

  return (
    <>
      <p className={`${textSize} font-light`}>
        <span className="text-[#3b82f6] font-semibold">AT</span>Studio
      </p>
    </>
  );
}

export default Logo;
