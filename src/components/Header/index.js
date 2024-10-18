import { Link } from 'react-router-dom';
import { FaFilm } from 'react-icons/fa';
import './header.css';

function Header() {
    return (
        <header>
            <div className='container'>
                <Link className='logo' to='/'>MovieFlix</Link>
                <Link className='favoritos' to='/favoritos'>{ <FaFilm/> } Meus Filmes</Link>
            </div>
        </header>
    )
}

export default Header;