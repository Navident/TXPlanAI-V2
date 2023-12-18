import HeaderBar from "../HeaderBar/HeaderBar";
import { Link } from 'react-router-dom';
import logo from '../../assets/navident-logo.svg';

const SignupForm = () => {
    return (
        <div className="login-container">
            <HeaderBar
                leftCornerElement={<img src={logo} alt="Logo" className="navident-logo" />}
                rightCornerElement=
                {<div className="header-extra-text">
                    <p>ALREADY HAVE AN ACCOUNT? <Link to="/login" className="link">LOG IN</Link></p>
                </div>}
            >

            </HeaderBar>
            <div className="content-container">
                <div className="side-container left-side">
                    <div className="side-text">
                        <h2>Dentistry</h2>
                        <h3>Innovation</h3>
                    </div>
                </div>
                <div className="side-container right-side">
                    <div className="side-text">
                        <h2>Sign Up</h2>
                        <p>
                            Join our community and streamline your dental practice with
                            automated treatment planning. Embrace efficiency and enhance patient
                            satisfaction with our cutting-edge tools. Let's get started on revolutionizing your workflow!
                        </p>
                        <p>Create Your Account</p>

                        <form className="signup-form">
                            <input type="text" id="username" name="username" placeholder="Username" />
                            <input type="password" id="password" name="password" placeholder="Password" />
                            <button type="submit" className="green-button">Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
