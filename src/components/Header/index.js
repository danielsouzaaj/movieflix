import { Link } from 'react-router-dom';
import './header.css';

function Header() {
    return (
        <header>
            <div className='container'>
                <Link className='logo' to='/'>MovieFlix</Link>
                <Link className='favoritos' to='/favoritos'>Meus FIlmes</Link>
            </div>
        </header>
    )
}

export default Header;