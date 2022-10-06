import React from "react"
import { useParams, useLocation, useNavigate} from "react-router-dom";

export const Hoc = (props) => {
    console.log(props, props.children)
    return (
        props.children
    )
}

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let {chatID} = useParams();
        return (
        <Component
            {...props}
            chatId={chatID}
        />
        );
    }

    return ComponentWithRouterProp;
}

export default withRouter
    