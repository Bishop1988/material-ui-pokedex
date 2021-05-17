import React, { useState, useEffect } from 'react'
import { Typography, Link, CircularProgress, Button } from '@material-ui/core'
import { toFirstCharUppercase } from './constants'
import axios from 'axios'

export default function Pokemon(props) {
    const { match, history } = props
    const { params } = match
    const { pokemonId } = params
    const [pokemon, setPokemon ] = useState(undefined)

    useEffect(() => {
        axios
            .get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
            .then(function (response) {
                const { data } = response
                setPokemon(data)
            })
            .catch(function (error) {
                setPokemon(false)
            })
    }, [pokemonId])

    const generatePokemonJSX = () => {
        const { name, id, species, height, weight, types, sprites } = pokemon
        const fullImageUrl = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`
        const { front_default } = sprites
        return (
            <>
            <Typography variant="h1">
                {`${id}.`} {toFirstCharUppercase(name)}
                <img src={front_default} />
            </Typography>
            <img style={{ width: "300px", height: "300px" }} src={fullImageUrl} />
            <Typography variant="h3">Pokemon Info</Typography>
            <Typography>
                {"Species: "}
                <Link href={species.url}>{species.name}</Link>
            </Typography>
            <Typography>Height: {height}</Typography>
            <Typography>Weight: {weight}</Typography>
            <Typography variant="h6"> Types:</Typography>
            {types.map((typeInfo) => {
                const { type } = typeInfo
                const { name } = type
                return <Typography key={name}> {`${name}`}</Typography>
            })}
            </>
        )
    }
    
    return (
        <>
            {pokemon === undefined && <CircularProgress />}
            {pokemon !== undefined && pokemon && generatePokemonJSX()}
            {pokemon === false && <Typography> Pokemon not found</Typography>}
            {pokemon !== undefined && (
                <Button variant="contained" onClick={() => history.push("/")}>
                    back to pokedex
                </Button>
            )}
        </>
    )
}

// States of the component

    // 1. pokemon = undefined, that means we are getting the info => return a loading progress bar
    // 2. pokemon = good data, that means we've gotten the info => return actual info (generatePokemonJSX)
    // 3. pokemon = bad data / false, this will happen when we make the API request and get nothing back because someone passed in a invalid id like instead of http://localhost:3000/1 someone passes http://localhost:3000/234123412341234123 => return pokemon not found