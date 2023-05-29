import React from "react";
import './Animals.css'
import AnimalCard from '../AnimalCard/AnimalCard'
import { Animal } from '../../types';
import { Link } from 'react-router-dom'

interface AnimalProps {
  animals: Animal[]
}

const Animals:React.FC<AnimalProps> = (props:AnimalProps) => {
  const { animals } = props

  if (animals.length === 0) {
    return <p>Please hang tight while we find your perfect pet...</p>; 
  }

  return (
    <div>
      {animals.map(animal => (

        <Link key={animal.id} to={`/${animal.id}`} style={{ textDecoration: 'none' }} > 
        <AnimalCard 
        key={animal.id}
        animalDetails={animal} />
        </Link>
      ))}
    </div>
  )
}

export default Animals;

