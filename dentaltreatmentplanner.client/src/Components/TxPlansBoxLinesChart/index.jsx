import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
	StyledHomeBoxBottomContainer,
	StyledSeparator,
	StyledHomeBoxTopContainer,
} from "../../Pages/Dashboard/index.style";
import {
	StyledLargeText,
	StyledUnderlinedText,
	StyledLightGrey2Text,
	StyledRoundedBoxContainer,
	StyledRoundedBoxContainerInner,
} from "../../GlobalStyledComponents";

const data = [
	{ name: 'Jan', uv: 4000 },
	{ name: 'Feb', uv: 3000 },
	{ name: 'Mar', uv: 4000 },
	{ name: 'Apr', uv: 3000 },
	{ name: 'May', uv: 4000 },
	{ name: 'Jun', uv: 3000 },
	{ name: 'Jul', uv: 4000 },
	{ name: 'Aug', uv: 3000 },
	{ name: 'Sep', uv: 4000 },
	{ name: 'Oct', uv: 3000 },
	{ name: 'Nov', uv: 4000 },
	{ name: 'Dec', uv: 3000 },
];

const TxPlansBoxLinesChart = () => {
    return (
        <StyledRoundedBoxContainer>
            <StyledRoundedBoxContainerInner flexBasisZero padding="20px">
                <StyledHomeBoxTopContainer>
                    <div className="large-text">TX Plans Generated</div>
                </StyledHomeBoxTopContainer>
                <StyledSeparator />
                <StyledHomeBoxBottomContainer>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </StyledHomeBoxBottomContainer>
            </StyledRoundedBoxContainerInner>
        </StyledRoundedBoxContainer>
    );
};

export default TxPlansBoxLinesChart;