"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProject } from "@/hooks/use-project";
import { cn, formatDateOrDaysAgo } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const CommitLog = () => {
  const { projectId, project } = useProject();
  const { data: commits } = api.project.getCommit.useQuery({ projectId });

  return (
    <>
      <ul className="space-y-6">
        {commits?.map((commit, commitIndex) => {
          return (
            <li key={commit.id} className="relative flex gap-x-4">
              <div
                className={cn(
                  "absolute left-0 top-0 flex w-6 justify-center",
                  commitIndex === commits.length - 1 ? "h-6" : "-bottom-6",
                )}
              >
                <div className="w-px translate-x-1 bg-gray-200"></div>
              </div>

              <>
                <Avatar>
                  <AvatarImage
                    src={commit.commitAuthorAvatar}
                    alt="commit avatar"
                  />
                  <AvatarFallback>{commit.commitAuthorName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-inset ring-gray-200">
                  <div className="flex justify-between gap-x-4">
                    <Link
                      target="_blank"
                      href={`${project?.githubUrl}/commits/${commit.commitHash}`}
                      className="py-0.5 text-xs leading-5 text-gray-500"
                    >
                      <span className="font-medium text-gray-900">
                        {commit.commitAuthorName}
                      </span>{" "}
                      <span className="inline-flex items-center">
                        committed <ExternalLinkIcon className="ml-1 size-3" />
                        <span className="ml-3 text-xs">
                          {formatDateOrDaysAgo(
                            new Date(commit.commitDate).toISOString(),
                          )}
                        </span>
                      </span>
                    </Link>
                  </div>
                  <span className="font-semibold">{commit.commitMessage}</span>
                  <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500">
                    {commit.summary}
                  </pre>
                </div>
              </>
            </li>
          );
        })}
      </ul>
    </>
  );
};
