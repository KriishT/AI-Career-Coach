import getAssessments from "@/actions/interview";
import React from "react";
import Quiz from "./_components/Quiz";
import StatsCard from "./_components/StatsCard";
import PerformanceChart from "./_components/PerformanceChart";
import QuizList from "./_components/QuizList";

const Page = async () => {
  const assessments = await getAssessments();
  return (
    <div>
      <div>
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
        <div className="space-y-6">
          <StatsCard assessments={assessments} />
          <PerformanceChart assessments={assessments} />
          <QuizList assessments={assessments} />
        </div>
      </div>
    </div>
  );
};

export default Page;
