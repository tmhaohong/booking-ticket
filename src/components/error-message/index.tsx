import cn from '@/helpers/classname-helper';

const ErrorMessage = ({ message, className }: { message: string, className?: string }) => <span className={cn("absolute top-0.5 right-0 z-1 h-fit rounded-md border border-line bg-gray-100 px-3 py-1 text-red-600 text-xs", className)}>
  {message}
</span>;

export default ErrorMessage;
