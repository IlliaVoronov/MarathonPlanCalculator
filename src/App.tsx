import { Link } from "react-router-dom"
import { lazy} from "react";
const Hyperspeed = lazy(() => import("./react-bits/Backgrounds/Hyperspeed/Hyperspeed"));
import { useEffect } from "react";




export default function App() {
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);


  return (
    <div className="min-h-screen min-w-screen ">

      <header className="relative flex flex-col gap-20 items-center text-center justify-center h-[100vh]  overflow-hidden font-extrabold ">

        <div className="absolute inset-0 w-full h-full -z-10">
          <Hyperspeed
            effectOptions={{
              onSpeedUp: () => { },
              onSlowDown: () => { },
              distortion: 'turbulentDistortion',
              length: 400,
              roadWidth: 10,
              islandWidth: 2,
              lanesPerRoad: 4,
              fov: 90,
              fovSpeedUp: 0,
              speedUp: 2,
              carLightsFade: 0.4,
              totalSideLightSticks: 10,
              lightPairsPerRoadWay: 40,
              shoulderLinesWidthPercentage: 0.05,
              brokenLinesWidthPercentage: 0.1,
              brokenLinesLengthPercentage: 0.5,
              lightStickWidth: [0.12, 0.5],
              lightStickHeight: [1.3, 1.7],
              movingAwaySpeed: [60, 80],
              movingCloserSpeed: [-120, -160],
              carLightsLength: [400 * 0.03, 400 * 0.2],
              carLightsRadius: [0.05, 0.14],
              carWidthPercentage: [0.3, 0.5],
              carShiftX: [-0.8, 0.8],
              carFloorSeparation: [0, 5],
              colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0xFFFFFF,
                brokenLines: 0xFFFFFF,
                leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
                rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
                sticks: 0x03B3C3,
              }
            }}
          />
        </div>
        <h1 className="text-white text-3xl">Welcome to the marathon training plan creator.</h1>
        <Link to={"/questions"}>
          <button onClick={() => console.log("Click")} className="bg-secondary py-3 px-4 text-2xl  rounded hover:bg-black hover:text-primary transition-all duration-300 cursor-pointer dark:text-black">Make a plan for me</button>
        </Link>
      </header>

    </div>
  )
}


