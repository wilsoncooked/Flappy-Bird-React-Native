import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableWithoutFeedback, Text } from 'react-native';
import Bird from './components/Bird.js'
import Obstacles from './components/Obstacles.js';

export default function App() {
  const screenWidth = Dimensions.get("screen").width
  const screenHeight = Dimensions.get("screen").height

  // bottom left of the div
  const birdLeft = screenWidth / 2
  const [birdBottom, setBirdBottom] = useState(screenHeight/2)
  const [obstaclesLeftFirst, setObstaclesLeftFirst] = useState(screenWidth)
  const [obstaclesLeftSecond, setObstaclesLeftSecond] = useState(screenWidth + screenWidth / 2 + 30)
  const [obstaclesNegHeightFirst, setObstaclesNegHeightFirst] = useState(0)
  const [obstaclesNegHeightSecond, setObstaclesNegHeightSecond] = useState(Math.random() * 100)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const gravity = 3
  const obstacleWidth = 60
  const obstacleHeight = 300
  const gap = 200
  let gameTimerId
  let obstaclesLeftTimerIdFirst
  let obstaclesLeftTimerIdSecond

  const gameOver = () => {
    clearInterval(gameTimerId)
    clearInterval(obstaclesLeftTimerIdFirst)
    clearInterval(obstaclesLeftTimerIdSecond)
    setIsGameOver(true)
  }

  const jump = () => {
    if (!isGameOver && (birdBottom < screenHeight)) {
      setBirdBottom(birdBottom => birdBottom + 50)
    }
  }

  // start bird falling
  useEffect(() => {
    if (birdBottom > 0) {
      gameTimerId = setInterval(() => {setBirdBottom(birdBottom => birdBottom - gravity)} , 30)

      return () => {
        clearInterval(gameTimerId)
      }
    }
  }, [birdBottom])

  // start first obstacles
  useEffect(() => {
    if (obstaclesLeftFirst > -obstacleWidth) {
      obstaclesLeftTimerIdFirst = setInterval(() => {
        setObstaclesLeftFirst(obstaclesLeftFirst => obstaclesLeftFirst - 5)
      }, 30)
      return () => {
        clearInterval(obstaclesLeftTimerIdFirst)
      }
    } else {
      setObstaclesLeftFirst(screenWidth)
      setObstaclesNegHeightFirst(- Math.random() * 100)
      setScore(score + 1)
    }
  }, [obstaclesLeftFirst])

    // start second obstacles
    useEffect(() => {
      if (obstaclesLeftSecond > -obstacleWidth) {
        obstaclesLeftTimerIdSecond = setInterval(() => {
          setObstaclesLeftSecond(obstaclesLeftSecond => obstaclesLeftSecond - 5)
        }, 30)
        return () => {
          clearInterval(obstaclesLeftTimerIdSecond)
        }
      } else {
        setObstaclesLeftSecond(screenWidth)
        setObstaclesNegHeightSecond(- Math.random() * 100)
        setScore(score + 1)

      }
    }, [obstaclesLeftSecond])


    //  check for collisions
    useEffect(() => {
      if (!isGameOver &&
        ((birdBottom < (obstaclesNegHeightFirst + obstacleHeight + 30) ||
        birdBottom > (obstaclesNegHeightFirst + obstacleHeight + gap -30)) &&
        (obstaclesLeftFirst > screenWidth/2 -30 && obstaclesLeftFirst < screenWidth/2 + 30 )
        )
        || 
        ((birdBottom < (obstaclesNegHeightSecond + obstacleHeight + 30) ||
        birdBottom > (obstaclesNegHeightSecond + obstacleHeight + gap -30)) &&
        (obstaclesLeftSecond > screenWidth/2 -30 && obstaclesLeftSecond < screenWidth/2 + 30 )
        )
        ) 
        {
        console.log('game over')
        gameOver()
      }
    })

   
  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        {isGameOver && <Text>Score: {score}</Text>}
        <Bird birdBottom={birdBottom} birdLeft={birdLeft}/>
        <Obstacles color="green" obstacleWidth={obstacleWidth} obstacleHeight={obstacleHeight} gap={gap} obstaclesLeft={obstaclesLeftFirst} randomBottom={obstaclesNegHeightFirst} />
        <Obstacles color="orange" obstacleWidth={obstacleWidth} obstacleHeight={obstacleHeight} gap={gap} obstaclesLeft={obstaclesLeftSecond} randomBottom={obstaclesNegHeightSecond} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
