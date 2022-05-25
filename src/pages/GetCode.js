import { useParams } from "react-router-dom";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function GetCode() {
    let { id } = useParams();
    return (
        <div>
            <p>The id is: { id }</p>
            <button className="">HI</button>
        </div>
    );
};

export default GetCode;