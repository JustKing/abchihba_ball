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

function App() {
  const { viewWidth } = useAdaptivity();
  const [firstLoading, setFirstLoading] = useState(true);
  const ui = 10;
  const ball = new Ball("#balanceBall", ui);

  useEffect(() => {
    let beta = '0';
    let gamma = '0';
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === "VKWebAppDeviceMotionChanged") {
        let gData: any = data;
        beta = gData.beta
        gamma = gData.gamma
      }
    });
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
        if (ball.hasCanvas) {
          ball.draw(+beta, +gamma);
        }
      }
    }, ui);
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
