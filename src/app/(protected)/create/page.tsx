"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRefetch } from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch();

  const onSubmit = (data: FormInput) => {
    createProject.mutate(
      {
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success("项目创建成功");
          refetch();
          reset();
        },
        onError: () => {
          toast.error("项目创建失败");
        },
      },
    );
  };

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <div className="w-full space-y-10 sm:max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">链接你的GitHub仓库</h1>

          <p className="text-muted-foreground">
            输入仓库的 URL 以将其链接到这里
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center space-y-4">
              <Input
                {...register("projectName", { required: true })}
                placeholder="项目名称"
                required
              />
              <Input
                {...register("repoUrl", { required: true })}
                placeholder="GitHub 仓库 URL"
                required
              />
              <Input
                {...register("githubToken")}
                placeholder="GitHub Token （可选）"
              />
              <Button
                type="submit"
                className="w-fit"
                disabled={createProject.isPending}
              >
                创建项目
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
