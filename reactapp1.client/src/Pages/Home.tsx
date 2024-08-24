import FileUpload from "../Components/FileUpload.tsx";
import FileList from "../Components/FileList.tsx";
import LogoutLink from "../Components/LogoutLink.tsx";
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";

function Home() {
    return (
        <AuthorizeView>
            <span><LogoutLink>Logout <AuthorizedUser value="email" /></LogoutLink></span>
            <FileUpload />
            <FileList />
        </AuthorizeView>
    );
}

export default Home;