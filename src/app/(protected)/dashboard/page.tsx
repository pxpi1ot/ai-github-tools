"use client";
import { Badge } from "@/components/ui/badge";
import { useProject } from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";
import { ExternalLinkIcon, GithubIcon } from "lucide-react";
import Link from "next/link";
import { CommitLog } from "./commit-log";
import { AskQuestionCard } from "./ask-question-card";

const DashboardPage = () => {
  const { project } = useProject();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        {/* Github link */}

        <div className="w-fit rounded-md bg-primary px-2 py-1">
          <div className="flex items-center">
            <GithubIcon className="size-5 text-white" />
            <div className="ml-2">
              <p className="text-sm font-medium text-white">
                此项目链接于 {""}
                <Link
                  href={project?.githubUrl ?? " "}
                  className="inline-flex items-center text-white/80 hover:underline"
                >
                  {project?.githubUrl}
                  <ExternalLinkIcon className="ml-1 size-3" />
                </Link>
              </p>
            </div>
          </div>
        </div>
        {/* <div className="mt-4 flex items-center gap-4">
          TeamMembers InviteButton ArchiveButton
        </div> */}
      </div>

      {/* <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
        2:44:16
          <AskQuestionCard />
          MeetingCard
        </div>
      </div> */}

      <div className="mt-8">
        <CommitLog />
      </div>
    </div>
  );
};

export default DashboardPage;
