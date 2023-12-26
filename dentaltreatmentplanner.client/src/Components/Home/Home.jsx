import './Home.css';
import { useNavigate } from 'react-router-dom';
import dentalHero from "../../assets/home-hero.jpg";
import { TextField, Button } from "@mui/material";
import HeaderBar from "../HeaderBar/HeaderBar";
import RoundedButton from "../RoundedButton/RoundedButton";
import logo from '../../assets/navident-logo.svg';
import googleIcon from '../../assets/google-icon.svg';
import appleIcon from '../../assets/apple-icon.svg';
import facebookIcon from '../../assets/facebook-icon.svg';

const Home = () => {
	const navigate = useNavigate();

	const handleSignUpClick = () => {
		navigate("/signup"); // This will navigate to the SignUp page
	};

	const handleLoginClick = () => {
		navigate("/dashboard"); // This will navigate to the SignUp page
	};

	return (
		<div className="home-container">
			<HeaderBar
				leftCornerElement={<img src={logo} alt="Logo" className="navident-logo" />}		
				rightCornerElement=
				{<button className="green-outline-button" onClick={handleLoginClick}>
					Log in
				</button>}
			/>
			<div className="home-banner-container">
				<div className="home-left-side-container">
					<div className="home-left-text-section">
						<h1 className="primary-heading">
							<span>Treatment Plan <br /> With One Click.</span>
						</h1>
						<p className="primary-text">
							Help your associates, assistants, treatment coordinator,
							or dog (we haven't tried yet) treatment plan.
						</p>
					</div>
					<div className="rounded-login-buttons-container">
						<RoundedButton icon={googleIcon} text="Continue with Google" />
						<RoundedButton icon={facebookIcon} text="Continue with Facebook" />
						<RoundedButton icon={appleIcon} text="Continue with Apple" />
					</div>
					<div className="divider-container">
						<div className="line"></div>
						<span className="divider-text">OR</span>
						<div className="line"></div>
					</div>
					<RoundedButton
						text="Sign Up with email"
						backgroundColor="#7777a1"
						textColor="white"
						border={false} 
					/>
					<div className="home-left-text-bottom">
						By signing up, you agree to the <u>Terms of Service</u> and <u>Privacy Policy</u>,
						including <u>cookie use</u>.
					</div>
				</div>
				<div className="home-right-side-container">
					<div className="home-image-hero">
						<img src={dentalHero} alt="" />
					</div>

				</div>
			</div>
		</div>
	);
};

export default Home;
