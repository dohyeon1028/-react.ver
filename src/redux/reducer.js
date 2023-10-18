import { combineReducers } from "redux";

const initMember = {
    members: [
        {
            name: "Julia",
            position: "President",
            pic: "member1.jpg"
        },
        {
            name: "David",
            position: "Vice President",
            pic: "member2.jpg"
        },
        {
            name: "Emily",
            position: "UI Designer",
            pic: "member3.jpg"
        },
        {
            name: "Paul",
            position: "Front-end Engineer",
            pic: "member4.jpg"
        },
        {
            name: "Sara",
            position: "Back-end Engineer",
            pic: "member5.jpg"
        },
        {
            name: "Michael",
            position: "Project Manager",
            pic: "member6.jpg"
        }
    ]
}
//  초기 데이터를 state에 저장했다가 추구 action 객체가 전달되면 액션의 타이벵 따라서 기존의 데이터(state)를 변경해서 return하는 함수
const memberReducer = (state = initMember, action) => {
    switch (action.type) {
        case "SET_MEMBERS":
            return { ...state, members: action.payload };

        default:
            return state;
    }
}

const reducers = combineReducers({ memberReducer });

export default reducers

/*
라이브러리 

useReducer는 리액트 내장된 Hook 중에 하나로, 리액트 애플리케이션 상태 관리를 위한 방법이다. 반면에, Redux는 별도의 라이브러리로 리액트와 독립적으로 사용이 가능하며 애플리케이션의 전역상태관리를 위한 고급 도구이다.

범위 
    useReducer는 일반적으로 한 컴포넌트 내부에서 상태를 관리한다.(지역적)
    Redux의 Reducer는 여러 컴포넌트에서 전역 상태를 관리 (전역적)
*/