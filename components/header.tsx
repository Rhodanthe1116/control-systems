import Link from 'next/link'

const Header = () => {
    return (
        <div className="flex space-x-4 font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
            <Link href="/">
                <a className="hover:underline">Control</a>
            </Link>
            <Link href="/ch4">
                <a className="hover:underline">ch4</a>
            </Link>
            <Link href="/ch8">
                <a className="hover:underline">ch8</a>
            </Link>
            <Link href="/ch10">
                <a className="hover:underline">ch10</a>
            </Link>
            <Link href="/aem/ch4">
                <a className="hover:underline">aem-ch4</a>
            </Link>
            <Link href="/aem/ch5">
                <a className="hover:underline">aem-ch5</a>
            </Link>

        </div>
    )
}

export default Header
