import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Myc2e from './C2EComponents/myc2e';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCallback } from 'react';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';

function App() {
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);
  return (
    <Router>
      <div className="ts-particles">
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: '#fff',
              },
            },
            fpsLimit: 60,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: 'push',
                },
                onHover: {
                  enable: true,
                  mode: 'repulse',
                },
                resize: true,
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 150,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: '#ccc',
              },
              links: {
                color: '#ccc',
                distance: 150,
                enable: true,
                opacity: 0.6,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                directions: 'none',
                enable: true,
                outModes: {
                  default: 'bounce',
                },
                random: false,
                speed: 2,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.3,
              },
              shape: {
                type: 'circle',
              },
              size: {
                value: { min: 1, max: 5 },
              },
            },
            detectRetina: true,
          }}
        ></Particles>
      </div>
      <Switch>
        <Route exact path="/">
          <Myc2e />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
