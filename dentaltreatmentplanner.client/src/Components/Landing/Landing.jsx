import './Landing.css';
import { useNavigate } from 'react-router-dom';
import dentalHero from "../../assets/home-hero.jpg";
import { TextField, Button } from "@mui/material";
import HeaderBar from "../Common/HeaderBar/HeaderBar";
import RoundedButton from "../Common/RoundedButton/RoundedButton";
import logo from '../../assets/navident-logo.svg';
import googleIcon from '../../assets/google-icon.svg';
import appleIcon from '../../assets/apple-icon.svg';
import facebookIcon from '../../assets/facebook-icon.svg';

const Landing = () => {
	const navigate = useNavigate();

	const handleSignUpClick = () => {
		navigate("/signup"); // This will navigate to the SignUp page
	};

	const handleLoginClick = () => {
		navigate("/login"); // This will navigate to the SignUp page
	};

	return (
		<div className="landing-container">
			<HeaderBar
				leftCornerElement={<img src={logo} alt="Logo" className="navident-logo" />}		
				rightCornerElement=
				{
					<RoundedButton
						text="Log in"
						backgroundColor="white"
						textColor="black"
						border={true}
                        width="150px" 
                        borderColor="#A2E1C9"  
						onClick={handleLoginClick}
						className="outline-button-hover"
					/>
				}

			/>
			<div className="landing-banner-container">
				<div className="landing-left-side-container">
					<div className="landing-left-text-section">
						<h1 className="primary-heading">
							<span>Treatment Plan <br /> With One Click.</span>
						</h1>
						<p className="primary-text">
							Help your associates, assistants, treatment coordinator,
							or dog (we haven't tried yet) treatment plan.
						</p>
					</div>
					<div className="rounded-login-buttons-container">
						<RoundedButton icon={googleIcon} text="Continue with Google" className="outline-button-hover" />
						<RoundedButton icon={facebookIcon} text="Continue with Facebook" className="outline-button-hover" />
						<RoundedButton icon={appleIcon} text="Continue with Apple" className="outline-button-hover" />
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
						onClick={handleSignUpClick}
						className="purple-button-hover"
					/>
					<div className="landing-left-text-bottom">
						By signing up, you agree to the <u>Terms of Service</u> and <u>Privacy Policy</u>,
						including <u>cookie use</u>.
					</div>
				</div>
				<div className="landing-right-side-container">
					<div className="landing-image-hero">
						<img src={dentalHero} alt="" />
					</div>

				</div>
			</div>
		</div>
	);
};

export default Landing;
