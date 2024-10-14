import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaRegTrashAlt } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import placeholderImg from '../../assets/placeholder.jpg';
import './favoritos.css';

function Favoritos() {

    const [favoritos, setFavoritos] = useState([])

    useEffect(() => {
        const listMovie = localStorage.getItem('@movieflix')
        setFavoritos(JSON.parse(listMovie) || [])
    }, [])

    function excluir(id) {
        const filtered = favoritos.filter(item => item.id !== id)

        setFavoritos(filtered)
        localStorage.setItem('@movieflix', JSON.stringify(filtered))
        toast.warn('Filme removido com sucesso!')
    }

    return (
        <div className="favoritos">
            <div className="container">
                <h1>Meus filmes</h1>
                
                {favoritos.length === 0 && <span>Você não possui nenhum filme!</span>}

                <ul>
                    {favoritos.map((filme) => {

                        return (
                            <li key={filme.id}>
                                {
                                    filme.poster_path !== null ? (
                                        <LazyLoadImage
                                            src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`} 
                                            alt={filme.title} 
                                            effect="blur"
                                            placeholderSrc={placeholderImg}
                                        />
                                    ) : (
                                        <img 
                                            src={placeholderImg} 
                                            alt={filme.title} 
                                        />
                                    )
                                }
                                
                                <div>
                                    <div className="btn-container">
                                        <Link to={`/filme/${filme.id}`}>Detalhes</Link>
                                        <button onClick={() => excluir(filme.id)}>{<FaRegTrashAlt/>}</button>
                                    </div>       
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Favoritos;