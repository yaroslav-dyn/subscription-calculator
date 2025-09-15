import { cloneElement, type ReactElement, type ReactNode } from 'react'
import { GripVertical } from 'lucide-react'
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';


const SortableItem = ({ id, children }: { id: string, children: ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  // Clone the child element to add the drag handle props
  const childWithProps = children ? cloneElement(children as ReactElement, {
    ...attributes,
    ...listeners,
  }) : null;


  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="absolute top-1 right-1 z-10 cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="text-white/50" />
      </div>
      {childWithProps}
    </div>
  );
}

export default SortableItem