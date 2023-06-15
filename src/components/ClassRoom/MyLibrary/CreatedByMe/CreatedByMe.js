import Menu from "./Menu/Menu"
import "./CreatedByMe.scss"
const CreatedByMe=()=>{
    return(
        <div className="mylibrary_created">
            <div className="mylibrary_created_item">
                <img className="mylibrary_created_item_img" src="" alt=""/>
                <div className="mylibrary_created_item_det">
                    <div className="mylibrary_created_item_det_dots"> <Menu/></div>
                   <div className="mylibrary_created_item_det_header">
                       QUIZ
                   </div>
                </div>
            </div>
        </div>
    )
}

export default CreatedByMe