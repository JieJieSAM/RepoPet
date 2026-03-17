export interface ZooRules {
  outputPaths: {
    summaryJson: string;
    dashboardSvg: string;
  };
}

export const zooRules: ZooRules = {
  outputPaths: {
    summaryJson: "data/account-summary.json",
    dashboardSvg: "assets/zoo-dashboard.svg"
  }
};
