import { useState } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

import { QuestionTooltip } from "@/components/molecules";
import { Button } from "@/components/atoms";

import { toLocalString, toBalanceString } from "@/utils";
import {
	selectWalletAddress,
	selectWalletBalance,
} from "@/store/slices/settingsSlice";
import { selectAllPools } from "@/store/slices/poolsSlice";
import appConfig from "@/appConfig";
import { StakingDrawer } from "../StakingDrawer/StakingDrawer";

export const StakingPoolList = () => {
	const walletAddress = useSelector(selectWalletAddress);
	const walletBalance = useSelector(selectWalletBalance);

	const allPools = useSelector(selectAllPools);

	if (!allPools.length)
		return <div className="text-center text-gray-600">No active pools</div>;

	return (
		<div>
			<ul role="list" className="space-y-4">
				{allPools.map((pool, index) => (
					<StakingPoolListItem
						walletAddress={walletAddress}
						key={index}
						apy={23.12 * index}
						walletBalance={walletBalance[pool.address] || null}
						{...pool}
					/>
				))}
			</ul>
		</div>
	);
};

const StakingPoolListItem = ({
	symbol = "NO NAME",
	address,
	walletAddress,
	apy,
	walletBalance,
	decimals = 18,
}) => {
	const [open, setOpen] = useState(false);

	const apyView =
		apy !== undefined &&
		(apy > 1e6 ? "> 1m." : `${toLocalString(+apy.toPrecision(4))}%`);
	const walletBalanceView =
		walletBalance && toBalanceString(walletBalance, decimals);

	return (
		<li className="flex flex-wrap items-center w-full px-4 py-3 space-y-2 border rounded-md shadow lg:space-y-0 lg:gap-4 lg:flex-nowrap bg-primary/10 border-primary/20">
			<div className="basis-[100%] w-full lg:basis-[30%] lg:w-[30%]">
				<div className="flex items-center mb-1 space-x-1 text-sm leading-none text-white/60">
					<div>Pool</div>
				</div>
				<a
					href={`${appConfig.RPC_META.blockExplorerUrls[0]}address/${address}`}
					target="_blank"
					className="flex items-center mt-3 space-x-2 text-lg font-bold leading-none"
				>
					<p className="overflow-hidden truncate">{symbol}</p>{" "}
					<ArrowTopRightOnSquareIcon className="inline shrink-0 w-[1em] h-[1em]" />
				</a>
			</div>

			<div className="basis-1/2 lg:basis-[25%]">
				<div className="flex items-center mb-1 space-x-1 text-sm leading-none text-white/60">
					<div>APY</div>{" "}
					<QuestionTooltip description="Rewards APY, not including income from trading fees" />
				</div>
				<div className="mt-3 text-lg font-bold leading-none">
					{apy !== undefined ? (
						apyView
					) : (
						<div className="h-[1em] w-[6em] rounded-md bg-white/20 animate-pulse" />
					)}
				</div>
			</div>

			<div className="basis-1/2 lg:basis-[25%]">
				<div className="flex items-center mb-1 space-x-1 text-sm leading-none text-white/60">
					<div>In my wallet</div>
				</div>
				<div className="mt-3 text-lg font-bold leading-none">
					{!!walletAddress ? (
						<>
							{walletBalance ? (
								walletBalanceView
							) : (
								<div className="h-[1em] w-[6em] rounded-md bg-white/20 animate-pulse" />
							)}
						</>
					) : (
						<span className="text-white/30">Unknown</span>
					)}
				</div>
			</div>

			<div className="basis-[100%] w-[100%] lg:basis-[20%] lg:w-[20%]">
				<Button block type="light" onClick={() => setOpen(true)}>
					Stake
				</Button>

				<StakingDrawer
					open={open}
					setOpen={setOpen}
					symbol={symbol}
					decimals={decimals}
					address={address}
				/>
			</div>
		</li>
	);
};
