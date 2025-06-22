"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import QuizResult from "./QuizResult";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

const QuizList = ({ assessments }) => {
  const [listData, setListData] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const router = useRouter();

  const handleQuizClick = (index) => {
    setCurrentQuiz(assessments[index]);
    console.log("Clicked on Quiz:", assessments[index]);
  };

  useEffect(() => {
    if (assessments) {
      const formattedData = assessments.map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd yyyy"),
        score: assessment.quizScore,
        improvementTip: assessment.improvementTip,
      }));
      setListData(formattedData);
    }
  }, [assessments]);
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="gradient-title text-2xl md:text-3xl">
            Recent Quizzes
          </CardTitle>
          <Button onClick={() => router.push("/interview/mock")}>
            Start New Quiz
          </Button>
        </CardHeader>
        <CardContent>
          {listData.map((assessment, index) => {
            return (
              <Card
                onClick={() => handleQuizClick(index)}
                className="mb-4 hover:cursor-pointer hover:bg-neutral-800"
                key={index}
              >
                <CardAction>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Quiz {index + 1}
                    </CardTitle>
                    <CardDescription>
                      Score: {assessment.score}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {assessment.improvementTip && (
                      <p className="text-sm text-muted-foreground">
                        Improvement Tip: {assessment.improvementTip}
                      </p>
                    )}
                  </CardContent>
                </CardAction>
              </Card>
            );
          })}
        </CardContent>
      </Card>
      <Dialog open={!!currentQuiz} onOpenChange={() => setCurrentQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <QuizResult
            result={currentQuiz}
            hideStartNew
            onStartNew={() => router.push("/interview/mock")}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizList;
