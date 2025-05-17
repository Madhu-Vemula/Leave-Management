import notFoundImage from "../assets/images/not-found.jpg"

const NotFound = () => {
    return (
        <div className="not-found-container">
            <img src={notFoundImage} alt="not-found-image" className="not-found-image" />
        </div>
    )
}
export default NotFound