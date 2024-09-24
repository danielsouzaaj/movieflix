import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
        alert('Filme excluido!')
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
                                <strong>{filme.title}</strong>
                                <div>
                                    <Link to={`/filme/${filme.id}`}>Detalhes</Link>
                                    <button onClick={() => excluir(filme.id)}>Excluir</button>
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