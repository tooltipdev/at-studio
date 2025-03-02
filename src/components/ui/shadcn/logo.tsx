function Logo({size: logoSize}: {size?: 'sm' | 'md' | 'lg'}) {
    let size, padding, fontSize

    switch(logoSize) {
        case 'lg':
            size = "size-24"
            padding = 'px-3'
            fontSize = 'text-4xl'
            break
        case 'md':
            size = 'size-16'
            padding = 'px-2'
            fontSize = 'text-3xl'
            break
        default:
            size = 'size-8'
            padding = 'px-1'
            fontSize = 'text-xl'
    }

    return (<>
        <div className="flex items-center">
            <img className={`${size}`} src="bsky-logo.png" />
            <span className={`${fontSize} ${padding}`}>+</span>
            <img className={`${size}`} src="oauth-logo.png" />
        </div>
    </>)
}

export default Logo