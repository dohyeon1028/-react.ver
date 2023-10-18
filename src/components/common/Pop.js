import { useRef, useImperativeHandle, forwardRef, useState } from "react"
import { motion, AnimatePresence } from 'framer-motion';

const Pop = forwardRef(({ children }, ref) => {
    const [Open, setOpen] = useState(false);
    useImperativeHandle(ref, () => {
        return {
            open: () => setOpen(true)
        }
    });
    return (
        <>
            <AnimatePresence>
                {Open &&
                    <motion.aside className="pop" initial={{ opacity: 0, scale: 0, rotate: 100 }} animate={{ opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.5 } }} exit={{ opacity: 0, rotate: 100, scale: 0, transition: { duration: 0.5, delay: 0.5 } }}>
                        <motion.div className="con" initial={{ opacity: 0, rotate: 100 }} animate={{ rotate: 0, opacity: 1, transition: { duration: 0.5, delay: 0.5 } }} exit={{ opacity: 0, scale: 0, rotate: 100, transition: { duration: 0.5 } }}>{children}</motion.div>
                        <motion.span className='close' initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.5 } }} exit={{ opacity: 0, x: 100 }}
                            onClick={() => setOpen(false)}
                        >close</motion.span>
                    </motion.aside>
                }
            </AnimatePresence >
        </>
    )
})

export default Pop

// function Pop({ setOpen, children }) {
//     return (
//         <aside className="pop">
//             <div className="con">{children}</div>
//             <span className='close'
//                 onClick={() => setOpen(false)}
//             >close</span>
//         </aside>
//     )
// }

/*
forwardRef의 흐름 
    1. pop의 화살표함수를 forwardRef의 인수로 전달된다.
    2. forwardRef로 전달되는 화살표함수의 두 번째 파라미터로 ref가 전달되고, 이것을 Gallery에서 Pop 컴포넌트와 연결된다. (갤러리의 Pop컴포넌트도 ref가 선언되어야 한다.)
    3. forwardRef 안에 있는 useImperativeHandle 함수를 호출하여 부모인 갤러리가 해당 메서드를 사용할 수 있게 된다.
    4. forwardRef 안에 있는 return값이 부모컴포넌트로 반한되기 때문에 부모컴포넌트가 자식컴포넌트를 참조할 수 있게 된다.
*/