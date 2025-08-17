"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { calculateBangusProfit } from "./model";
import { Share2, Copy, Check } from "lucide-react";

export default function Home() {
  const defaultInputs = {
    fcr: 2.0,
    fingerlings: 35000,
    fingerlingPrice: 3,
    feedPrice: 40,
    laborPerMonth: 22000,
    pondRent: 50000,
    survivalRate: 0.7,
    fingerlingWeight: 0.005,
    harvestWeight: 0.4,
    marketPrice: 120,
    otherCost: 50000,
    naturalFeedRatio: 0.4,
  };

  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(calculateBangusProfit(defaultInputs));
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Load parameters from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const data = params.get("data");
      
      if (data) {
        try {
          const decodedData = JSON.parse(atob(data));
          // Validate and merge with defaults to ensure all fields exist
          const validatedInputs = { ...defaultInputs, ...decodedData };
          setInputs(validatedInputs);
          setResults(calculateBangusProfit(validatedInputs));
        } catch (error) {
          console.error("Failed to parse shared data:", error);
        }
      }
    }
  }, []);

  // Generate share URL whenever inputs change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const encodedData = btoa(JSON.stringify(inputs));
      const url = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
      setShareUrl(url);
    }
  }, [inputs]);

  const handleInputChange = (key: string, value: number) => {
    const newInputs = { ...inputs, [key]: value };
    setInputs(newInputs);
    setResults(calculateBangusProfit(newInputs));
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals = 0) => {
    return new Intl.NumberFormat("zh-CN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bangus Farming Profit Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate costs, revenue and net profit for a 4-month farming cycle
          </p>
          <div className="mt-4">
            <Button
              onClick={handleShare}
              variant="outline"
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Share Calculator
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Parameters */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Basic Parameters
                </CardTitle>
                <CardDescription>Set core farming parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fingerlings">Number of Fingerlings</Label>
                    <Input
                      id="fingerlings"
                      type="number"
                      value={inputs.fingerlings}
                      onChange={(e) =>
                        handleInputChange("fingerlings", Number(e.target.value))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fingerlingPrice">
                      Fingerling Price (₱)
                    </Label>
                    <Input
                      id="fingerlingPrice"
                      type="number"
                      step="0.1"
                      value={inputs.fingerlingPrice}
                      onChange={(e) =>
                        handleInputChange(
                          "fingerlingPrice",
                          Number(e.target.value)
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="survivalRate">
                    Survival Rate: {(inputs.survivalRate * 100).toFixed(0)}%
                  </Label>
                  <Slider
                    id="survivalRate"
                    min={0.1}
                    max={1}
                    step={0.01}
                    value={[inputs.survivalRate]}
                    onValueChange={(value) =>
                      handleInputChange("survivalRate", value[0])
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="fcr">Feed Conversion Ratio (FCR)</Label>
                  <Input
                    id="fcr"
                    type="number"
                    step="0.1"
                    value={inputs.fcr}
                    onChange={(e) =>
                      handleInputChange("fcr", Number(e.target.value))
                    }
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Cost Parameters
                </CardTitle>
                <CardDescription>Set various cost expenses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="feedPrice">Feed Price (₱/kg)</Label>
                    <Input
                      id="feedPrice"
                      type="number"
                      value={inputs.feedPrice}
                      onChange={(e) =>
                        handleInputChange("feedPrice", Number(e.target.value))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="laborPerMonth">
                      Monthly Labor Cost (₱)
                    </Label>
                    <Input
                      id="laborPerMonth"
                      type="number"
                      value={inputs.laborPerMonth}
                      onChange={(e) =>
                        handleInputChange(
                          "laborPerMonth",
                          Number(e.target.value)
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pondRent">Pond Rent (₱/cycle)</Label>
                    <Input
                      id="pondRent"
                      type="number"
                      value={inputs.pondRent}
                      onChange={(e) =>
                        handleInputChange("pondRent", Number(e.target.value))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="otherCost">Other Costs (₱)</Label>
                    <Input
                      id="otherCost"
                      type="number"
                      value={inputs.otherCost}
                      onChange={(e) =>
                        handleInputChange("otherCost", Number(e.target.value))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="naturalFeedRatio">
                    Natural Feed Ratio:{" "}
                    {(inputs.naturalFeedRatio * 100).toFixed(0)}%
                  </Label>
                  <Slider
                    id="naturalFeedRatio"
                    min={0}
                    max={0.8}
                    step={0.01}
                    value={[inputs.naturalFeedRatio]}
                    onValueChange={(value) =>
                      handleInputChange("naturalFeedRatio", value[0])
                    }
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Harvest Parameters
                </CardTitle>
                <CardDescription>
                  Set fish weights and market prices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fingerlingWeight">
                      Fingerling Weight (kg)
                    </Label>
                    <Input
                      id="fingerlingWeight"
                      type="number"
                      step="0.001"
                      value={inputs.fingerlingWeight}
                      onChange={(e) =>
                        handleInputChange(
                          "fingerlingWeight",
                          Number(e.target.value)
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="harvestWeight">Harvest Weight (kg)</Label>
                    <Input
                      id="harvestWeight"
                      type="number"
                      step="0.1"
                      value={inputs.harvestWeight}
                      onChange={(e) =>
                        handleInputChange(
                          "harvestWeight",
                          Number(e.target.value)
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="marketPrice">Market Price (₱/kg)</Label>
                  <Input
                    id="marketPrice"
                    type="number"
                    value={inputs.marketPrice}
                    onChange={(e) =>
                      handleInputChange("marketPrice", Number(e.target.value))
                    }
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Display */}
          <div className="space-y-6">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-900">
                  Calculation Results
                </CardTitle>
                <CardDescription>
                  Financial analysis for 4-month farming cycle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Net Profit
                    </h3>
                    <p
                      className={`text-3xl font-bold ${
                        results.netProfit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(results.netProfit)}
                    </p>
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-700 mb-1">
                      Total Revenue
                    </h4>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(results.revenue)}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-700 mb-1">
                      Total Cost
                    </h4>
                    <p className="text-xl font-bold text-red-600">
                      {formatCurrency(results.totalCost)}
                    </p>
                  </div>
                </div>

                {/* Production Details */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Production Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Alive Fish Count:</span>
                      <span className="font-medium">
                        {formatNumber(results.aliveFish)} fish
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commercial Feed Usage:</span>
                      <span className="font-medium">
                        {formatNumber(results.commercialFeedKg, 1)} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Feed Cost Ratio:</span>
                      <span className="font-medium">
                        {formatNumber(results.feedCostRatio, 1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profitability Indicator */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Profitability
                  </h4>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        results.netProfit >= 0 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          Math.abs(results.netProfit / results.revenue) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Profit Margin:{" "}
                    {formatNumber(
                      (results.netProfit / results.revenue) * 100,
                      1
                    )}
                    %
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Share Section */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share Your Calculation
                </CardTitle>
                <CardDescription>
                  Share your parameters with others via link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="text-xs"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <Button
                      onClick={handleShare}
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Anyone with this link can view your calculation parameters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Optimization Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  {results.feedCostRatio > 40 && (
                    <p className="text-amber-600">
                      • Feed cost ratio is high, consider increasing natural
                      feed proportion
                    </p>
                  )}
                  {inputs.survivalRate < 0.7 && (
                    <p className="text-red-600">
                      • Survival rate is low, improve farming environment and
                      management
                    </p>
                  )}
                  {results.netProfit < 0 && (
                    <p className="text-red-600">
                      • Current parameters show loss, adjust costs or increase
                      selling price
                    </p>
                  )}
                  {results.netProfit > results.totalCost * 0.2 && (
                    <p className="text-green-600">
                      • Good profit margin, consider expanding farming scale
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
