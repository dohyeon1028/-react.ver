import React from "react";
import Layout from "../common/Layout";
import { useEffect, useRef, useState, useReducer } from "react";
const { kakao } = window;

const initialState = {
  location: null,
  Traffic: false,
  index: 0,
  info: [{
    title: "우리인재개발원",
    latlng: new kakao.maps.LatLng(37.4868352, 126.7830001),
    imgSrc: process.env.PUBLIC_URL + "/img/marker1.png",
    imgSize: new kakao.maps.Size(232, 99),
    imgPoz: { offset: new kakao.maps.Point(116, 99) }
  }, {
    title: "삼성전자",
    latlng: new kakao.maps.LatLng(37.2803896, 127.0077847),
    imgSrc: process.env.PUBLIC_URL + "/img/marker2.png",
    imgSize: new kakao.maps.Size(232, 99),
    imgPoz: { offset: new kakao.maps.Point(116, 99) }
  }, {
    title: "애플코리아",
    latlng: new kakao.maps.LatLng(37.5130194, 127.0597816),
    imgSrc: process.env.PUBLIC_URL + "/img/marker3.png",
    imgSize: new kakao.maps.Size(232, 99),
    imgPoz: { offset: new kakao.maps.Point(116, 99) }
  }],
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOCATION":
      return {
        ...state, location: action.loadMap
      }

    case "TOGGLE_TRAFFIC":
      return {
        ...state, traffic: !state.traffic
      }
    case "SET_INDEX":
      return {
        ...state, index: action.idx
      }
    default:
      return state;
    // throw new Error(`타입X ${action.type}`);
  }
}

function Location() {

  const [state, dispatch] = useReducer(reducer, initialState);
  const container = useRef(null);

  const { location, traffic, index, info } = state;

  var options = {
    center: info[index].latlng,
    level: 3
  };

  const imgSrc = info[index].imgSrc;
  const imgSize = info[index].imgSize;
  const imgPoz = info[index].imgPoz;
  const markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgPoz);

  useEffect(() => {
    container.current.innerHTML = ""; //지도 리셋
    const marker = new kakao.maps.Marker({
      position: options.center,
      image: markerImage,
    });
    const map_instance = new kakao.maps.Map(container.current, options);
    marker.setMap(map_instance);
    dispatch({ type: "SET_LOCATION", loadMap: map_instance });
    var mapTypeControl = new kakao.maps.MapTypeControl();
    map_instance.addControl(mapTypeControl, kakao.maps.ControlPosition.RIGHT);
    var zoomControl = new kakao.maps.ZoomControl();
    map_instance.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    const handleResize = () => {
      map_instance.setCenter(info[index].latlng);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [index, info, kakao.maps.ControlPosition.RIGHT, kakao.maps.Map, kakao.maps.MapTypeControl(), kakao.maps.ZoomControl()]);


  useEffect(() => {
    if (!location) return;
    traffic ? location.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC) : location.removeOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
  }, [traffic]);

  return (
    <Layout name={"Location"}>
      <p>Location</p>
      <div id="map" ref={container}></div>
      <div className="btn">
        <button className={traffic ? "on" : ""} onClick={() => {
          dispatch({ type: "TOGGLE_TRAFFIC" })

        }
        }>{traffic ? "Traffic on" : "Traffic off"}</button>
        <ul className="branch">
          {info.map((el, Ind) => {
            return (
              <li className={index === Ind ? "on" : ""} key={Ind} onClick={() => dispatch({ type: "SET_INDEX", idx: Ind })}>
                {info[Ind].title}
              </li>
            )
          })}
          {/* <li className={index === 0 ? "on" : ""} onClick={() => dispatch({ type: "SET_INDEX", idx: 0 })}>{info[0].title}</li>
                    <li className={index === 1 ? "on" : ""} onClick={() => dispatch({ type: "SET_INDEX", idx: 1 })}>{info[1].title}</li>
                    <li className={index === 2 ? "on" : ""} onClick={() => dispatch({ type: "SET_INDEX", idx: 2 })}>{info[2].title}</li> */}
        </ul>
      </div>
    </Layout >
  )
}
export default Location;

/*
useState와 useEffect를 섞어서 사용할대는 반드시 선후관계를 생각해야합니다
즉 state의 값이 없는 상태에서 useEffect가 실행되는 경우를 막아야합니다
*/