/**
 * Calculate Bangus farming 4-month cycle profit
 * @param {Object} params
 * @param {number} params.fcr Feed conversion ratio
 * @param {number} params.fingerlings Number of fingerlings stocked
 * @param {number} params.fingerlingPrice Price per fingerling (₱)
 * @param {number} params.feedPrice Commercial feed price (₱/kg)
 * @param {number} params.laborPerMonth Labor cost per month (₱)
 * @param {number} params.pondRent Pond rent per cycle (₱)
 * @param {number} params.survivalRate Survival rate (0~1)
 * @param {number} [params.fingerlingWeight=0.005] Initial fingerling weight (kg)
 * @param {number} [params.harvestWeight=0.4] Average harvest weight (kg)
 * @param {number} [params.marketPrice=120] Market price per kg (₱)
 * @param {number} [params.otherCost=50000] Other miscellaneous costs (₱)
 * @param {number} [params.naturalFeedRatio=0.4] Proportion of natural feed (0~1)
 * @returns {Object} { totalCost, revenue, netProfit, commercialFeedKg, aliveFish, feedCostRatio }
 */
export function calculateBangusProfit(params: {
  fcr: number;
  fingerlings: number;
  fingerlingPrice: number;
  feedPrice: number;
  laborPerMonth: number;
  pondRent: number;
  survivalRate: number;
  fingerlingWeight?: number;
  harvestWeight?: number;
  marketPrice?: number;
  otherCost?: number;
  naturalFeedRatio?: number;
}) {
  const {
    fcr,
    fingerlings,
    fingerlingPrice,
    feedPrice,
    laborPerMonth,
    pondRent,
    survivalRate,
    fingerlingWeight = 0.005,
    harvestWeight = 0.4,
    marketPrice = 120,
    otherCost = 50000,
    naturalFeedRatio = 0.4,
  } = params;

  // 成活数
  const aliveFish = fingerlings * survivalRate;

  // 总增重
  const totalWeightGain = aliveFish * (harvestWeight - fingerlingWeight); // kg

  // 商业饲料用量
  const commercialFeedKg = totalWeightGain * fcr * (1 - naturalFeedRatio);

  // 商业饲料成本
  const feedCost = commercialFeedKg * feedPrice;

  // 苗种成本
  const seedCost = fingerlings * fingerlingPrice;

  // 人工成本
  const laborCost = laborPerMonth * 4; // 4个月周期

  // 总成本
  const totalCost = feedCost + seedCost + laborCost + pondRent + otherCost;

  // 收入
  const revenue = aliveFish * harvestWeight * marketPrice;

  // 净利润
  const netProfit = revenue - totalCost;

  // 商业饲料在总成本中的占比
  const feedCostRatio = (feedCost / totalCost) * 100;

  return {
    totalCost,
    revenue,
    netProfit,
    commercialFeedKg,
    aliveFish,
    feedCostRatio, // 百分比
  };
}

// 示例调用
const result = calculateBangusProfit({
  fcr: 1.6,
  fingerlings: 35000,
  fingerlingPrice: 1.3,
  feedPrice: 40,
  laborPerMonth: 22000,
  pondRent: 50000,
  survivalRate: 0.7,
});

console.log(result);
