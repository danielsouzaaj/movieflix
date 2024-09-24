import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import './filme.css'

function Filme() {
    const { id } = useParams() 
    const browser = useNavigate()
    const [filme, setFilme] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadFilme() {
            await api.get(`movie/${id}`)
                .then((response) => {
                    setFilme(response.data)
                    setLoading(false)
                })
                .catch(() => {
                    browser('/', { replace: true })
                    return
                })
        }

        loadFilme()
    })

    function timeConvert(minutes) {
        let hours = Math.floor(minutes / 60)
        let minute =  minutes % 60

        hours = hours < 10 ? '0' + hours : hours
        minute = minute < 10 ? '0' + minute : minute

        return `${hours} h ${minute} min`
    }

    function saveMovie() {
        const list = localStorage.getItem('@movieflix')
        let savedMovie = JSON.parse(list) || []

        const hasMovie = savedMovie.some(movie => movie.id === filme.id)

        if (hasMovie) {
            alert('Filme ja foi salvo')
            return
        }

        savedMovie.push(filme)
        localStorage.setItem('@movieflix', JSON.stringify(savedMovie))
        alert('Filme salvo')
    }

    if (loading) {
        return (
            <div className="load-filme">
                <h2>Carregando detalhes...</h2>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="detalhes">
                <img src={`https://image.tmdb.org/t/p/w300/${filme.poster_path}`} alt={filme.title} />
                <div className="detalhes-info">
                    <h1>{filme.title}</h1>
                    <p>{filme.genres.map(genre => genre.name).join(', ')}</p>
                    <p>{filme.release_date.slice(0, 4)} &sdot; {timeConvert(filme.runtime)}</p>

                    <div className="detalhes-btn">
                        <a target="blank" rel="external" href={`https://www.youtube.com/results?search_query=${filme.title} trailer`}>Trailer</a>
                        <button onClick={saveMovie}>Salvar</button>
                    </div>
                    
                    <div className="sinopse">
                        <h2>Sinopse</h2>
                        <p>{filme.overview}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filme;