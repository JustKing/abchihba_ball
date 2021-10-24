import {
  useAdaptivity,
  AppRoot,
  SplitLayout,
  SplitCol,
  ViewWidth,
  View,
  Panel,
  PanelHeader,
  PanelSpinner,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import "./App.css";
import bridge from "@vkontakte/vk-bridge";
import Ball from "./Ball";

let _gyroscopeX = 0;
let _gyroscopeY = 0;

bridge.subscribe((event: any) => {
  console.log(event)
  if (event.detail.type === "VKWebAppGyroscopeChanged") {
    _gyroscopeX = event.detail.data.x;
    _gyroscopeY = event.detail.data.y;
  }
});

function App() {
  const { viewWidth } = useAdaptivity();
  const [firstLoading, setFirstLoading] = useState(true);
  const gyroscopeX = _gyroscopeX;
  const gyroscopeY = _gyroscopeY;
  const ball: Ball = new Ball("#balanceBall");

  useEffect(() => {
    if (firstLoading) {
      setTimeout(async () => {
        setFirstLoading(false);
      }, 1000);
    }
    const interval = setInterval(() => {
      if (!firstLoading) {
        if (!ball.hasCanvas) {
          ball.setCanvas();
        }
        console.log(gyroscopeX, gyroscopeY)
        ball.draw(+gyroscopeX, +gyroscopeY);
      }
    }, 10);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <AppRoot mode="full">
      <SplitLayout header={<PanelHeader separator={false} />}>
        <SplitCol spaced={viewWidth && viewWidth > ViewWidth.MOBILE}>
          <View activePanel="main">
            <Panel id="main">
              <header>
                <PanelHeader>Абчихба Шарик</PanelHeader>
              </header>
              {firstLoading ? (
                <PanelSpinner />
              ) : (
                <canvas
                  id="balanceBall"
                  width="1000px"
                  height="1000px"
                ></canvas>
              )}
            </Panel>
          </View>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  );
}

export default App;
