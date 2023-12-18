
import { useNavigate } from 'react-router-dom';
import dentalHero from "../../assets/home-hero.jpg";
import { TextField, Button } from "@mui/material";
import HeaderBar from "../HeaderBar/HeaderBar";
import logo from '../../assets/navident-logo.svg';


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
			/>
			<div className="home-banner-container">
				<div className="home-left-side-container">
					<div className="home-left-text-section">
						<h1 className="primary-heading">
							<span className="word-treatment">Automate</span> <br />
							<span className="word-progress">Treatment Plans</span>
						</h1>

						<p className="primary-text">
							Automatically treatment plan, code, and
							sequence both basic and complex patient
							cases using language that you normally use.
						</p>
					</div>
					<div className="home-image-hero">
						<img src={dentalHero} alt="" />
					</div>
				</div>
				<div className="home-right-side-container">
					<div className="home-right-text-section">
						<h1 className="home-right-side-heading">Welcome!</h1>
						<p className="home-right-side-text">
							For first time users, your doctor will email you an access
							<br />
							code. Click on Access Code below to create your account.
						</p>
					</div>

					<form className="login-form">
						<TextField id="username" label="Username" variant="standard" />
						<TextField
							id="password"
							label="Password"
							type="password"
							variant="standard"
							margin="normal"
						/>
					</form>
					<div className="button-container">
						<Button
							variant="contained"
							className="custom-contained-button"
							onClick={handleLoginClick}
						>
							Login
						</Button>
						<Button
							variant="outlined"
							className="custom-outlined-button"
							onClick={handleSignUpClick}
						>
							Sign Up
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
