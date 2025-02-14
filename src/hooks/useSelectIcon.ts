import { ref, provide } from 'vue';
import type { SelectIconContext } from '../types';
import { PROVIDER_ENUM } from '../constants';

export const useSelectIcon = () => {
  const selectAreaStyle = ref<Record<string, number>>({});
  const selectIconIndexSet = ref<Set<number>>(new Set());

  const handleUpdateSelectAreaStyle = (style: Record<string, number>) => {
    selectAreaStyle.value = style;
  }

  const handleAddSelectIcon = (index: number) => {
    selectIconIndexSet.value.add(index);
  }

  const handleRemoveSelectIcon = (index: number) => {
    selectIconIndexSet.value.delete(index);
  }

  const provideContext: SelectIconContext = {
    selectAreaStyle,
    selectIconIndexSet,
    handleUpdateSelectAreaStyle,
    handleAddSelectIcon,
    handleRemoveSelectIcon
  };

  provide(PROVIDER_ENUM.SELECT_ICON, provideContext);

  return provideContext;
} 